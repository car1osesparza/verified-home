/**
 * Homepage testimonials API. Keep responses non-fatal: always return JSON (prefer 200 +
 * fallback slides) so a bad Supabase row or client bug does not surface as a generic 500
 * to the marketing site.
 */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  FALLBACK_TESTIMONIAL_SLIDES,
  normalizeDbRow,
  sortTestimonialSlides,
} from "../../../lib/testimonials";

export const dynamic = "force-dynamic";

function getSupabase() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return null;
    }
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch (err) {
    console.error("[testimonials] Supabase client init failed:", err);
    return null;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get("sport") || "";

    const supabase = getSupabase();
    if (!supabase) {
      const items = sortTestimonialSlides(FALLBACK_TESTIMONIAL_SLIDES, sport);
      return NextResponse.json({ source: "fallback", items });
    }

    const { data, error } = await supabase
      .from("testimonials")
      .select("id, quote, name, role, image_url, sports, sort_order, created_at")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[testimonials]", error.message);
      const items = sortTestimonialSlides(FALLBACK_TESTIMONIAL_SLIDES, sport);
      return NextResponse.json({ source: "fallback", error: error.message, items }, { status: 200 });
    }

    const rows = (data || []).map(normalizeDbRow);
    if (!rows.length) {
      const items = sortTestimonialSlides(FALLBACK_TESTIMONIAL_SLIDES, sport);
      return NextResponse.json({ source: "fallback", items });
    }

    const items = sortTestimonialSlides(rows, sport);
    return NextResponse.json({ source: "supabase", items });
  } catch (err) {
    console.error("[testimonials] GET failed:", err);
    const sport = new URL(request.url).searchParams.get("sport") || "";
    const items = sortTestimonialSlides(FALLBACK_TESTIMONIAL_SLIDES, sport);
    return NextResponse.json({ source: "fallback", items, error: String(err?.message || err) }, { status: 200 });
  }
}
