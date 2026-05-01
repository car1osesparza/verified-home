"use client";

import { Card, Col, Row, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function ResourcesPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="eyebrow dark">Resources</div>
        <Title>Free tools and guidance</Title>
        <Paragraph className="lead">
          Supporting athletes, high school coaches, and recruiting education with practical resources.
        </Paragraph>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card id="academy" title="Recruiting Academy">
              Practical recruiting guidance, process checklists, and educational content.
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card id="athletes" title="Athletes">
              Free visibility tools to help athletes present complete and accurate profiles.
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card id="hs-coaches" title="HS Coaches">
              Resources to improve communication with college staffs and streamline athlete support.
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
