import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Row,
  Col
} from "react-bootstrap";
import {
  FaBriefcase,
  FaUsers,
  FaCheckCircle,
  FaEye
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";
import { getDashboardStats } from "../../../api/api";

const EmployerHome = () => {
  const employerId = localStorage.getItem("employerId");
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    selectedApplicants: 0,
    totalViews: 0,
    totalJobsPosted: 0,
    totalCVsSearched: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats(employerId);
        setStats({
          totalJobs: data.totalJobs || 0,
          activeJobs: data.activeJobs || 0,
          totalApplicants: data.totalApplicants || 0,
          selectedApplicants: data.selectedApplicants || 0,
          totalViews: data.totalViews || 0,
          totalJobsPosted: data.totalJobsPosted || 0,
          totalCVsSearched: data.totalCVsSearched || 0
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, [employerId]);

  const dashboardCards = [
    {
      label: "Jobs",
      value: stats.totalJobs,
      icon: <FaBriefcase className="dashboard-icon1" />,
      color: "indigo"
    },
    {
      label: "Applicants",
      value: stats.totalApplicants,
      icon: <FaUsers className="dashboard-icon2" />,
      color: "green"
    },
    {
      label: "Selected",
      value: stats.selectedApplicants,
      icon: <FaCheckCircle className="dashboard-icon3" />,
      color: "blue"
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      icon: <FaEye className="dashboard-icon4" />,
      color: "red"
    }
  ];

  const chartData = [
    { name: "Jobs", value: stats.totalJobs },
    { name: "Active", value: stats.activeJobs },
    { name: "Applicants", value: stats.totalApplicants },
    { name: "Selected", value: stats.selectedApplicants }
  ];

  return (
    <Container>
      <Row>
        {/* Main Dashboard Section */}
        <Col md={8}>
          <Row className="mb-3">
            {dashboardCards.map((card, index) => (
              <Col xl={6} md={6} className="mb-2" key={index}>
                <Card className="border h-100">
                  <Card.Body className="d-flex align-items-center">
                    <div className={`dot me-3 bg-${card.color}`}></div>
                    <div className="flex-grow-1">
                      <div className="text-gray-500 numbers2">
                        {card.value}
                        <span className="text-muted ms-2" style={{ fontWeight: 400, fontSize: "16px" }}>
                          {card.label}
                        </span>
                      </div>
                    </div>
                    <div className={`icon text-white bg-${card.color} ms-auto`}>
                      {card.icon}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Replaced Job Stats GIFs with Recharts Bar Chart */}
          <Row className="mb-3">
            <Col>
              <Card className="card-jobseeker">
                <Card.Header className="card-header-custom px-4 pt-3">
                  Jobs Status
                </Card.Header>
                <Card.Body style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#007bff" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Sidebar Section */}
        <Col md={4}>
          <Card className="card-jobseeker mb-3">
            <Card.Header className="card-header-custom px-3 pt-3">Job Posting</Card.Header>
            <Card.Body>
              <div className="text-muted px-2 mb-2" style={{ fontSize: "12px" }}>
                From : Wed May 26, 2021 &nbsp;&nbsp;&nbsp; To : Wed May 25, 2033
              </div>
              <Table size="sm" className="text-muted">
                <tbody>
                  <tr>
                    <th className="px-2" style={{ fontSize: "12px" }}>Total jobs allocated:</th>
                    <td className="px-2" style={{ fontSize: "12px" }}>Unlimited</td>
                  </tr>
                  <tr>
                    <th className="px-2" style={{ fontSize: "12px" }}>Total jobs posted:</th>
                    <td className="px-2" style={{ fontSize: "12px" }}>{stats.totalJobsPosted}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="card-jobseeker mb-3">
            <Card.Header className="card-header-custom px-3 pt-3">Resume</Card.Header>
            <Card.Body>
              <div className="text-muted px-2 mb-2" style={{ fontSize: "12px" }}>
                From : Wed May 26, 2021 &nbsp;&nbsp;&nbsp; To : Wed May 25, 2033
              </div>
              <Table size="sm">
                <tbody>
                  <tr>
                    <th className="px-2" style={{ fontSize: "12px" }}>Time allocated for CV's search:</th>
                    <td className="px-2" style={{ fontSize: "12px" }}>Unlimited</td>
                  </tr>
                  <tr>
                    <th className="px-2" style={{ fontSize: "12px" }}>Total no. of CVs searched:</th>
                    <td className="px-2" style={{ fontSize: "12px" }}>{stats.totalCVsSearched}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="card-jobseeker mb-4">
            <Card.Header className="card-header-custom px-3 pt-3">Subscription Plan</Card.Header>
            <Card.Body>
              <span className="text-muted d-block mb-2">
                Rate Card: Post your jobs and access resumes instantly.
              </span>
              <a href="https://ejobsitesoftware.com/jobboard_demo/rates.php" className="text-decoration-none">
                <i className="bi bi-cart"></i> Rate Card
              </a>
            </Card.Body>
          </Card>

          <div className="text-center">
            <Button variant="outline-secondary" className="w-100">
              <i className="bi bi-person-workspace me-2"></i> Start Applicant Tracking
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployerHome;
