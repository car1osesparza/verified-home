"use client";

import { Button, Card, Form, Input, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function LoginPage() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 520 }}>
        <Card>
          <Title level={2}>Log In</Title>
          <Paragraph>Access your Verified Athletics account.</Paragraph>
          <Paragraph style={{ marginBottom: 16, color: "#4c617f" }}>
            Prototype login page. Connect this form to your authentication flow when backend endpoints
            are ready.
          </Paragraph>
          <Form layout="vertical">
            <Form.Item label="Email">
              <Input type="email" placeholder="coach@program.edu" />
            </Form.Item>
            <Form.Item label="Password">
              <Input.Password placeholder="Enter password" />
            </Form.Item>
            <Button type="primary" block>
              Sign in
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}
