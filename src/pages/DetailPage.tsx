import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoChevronForwardOutline } from "react-icons/io5";
import { Card, Button } from "@/shared/components/ui";
import Typography from "@/shared/components/typography";
import PageHeader from "@/widgets/PageHeader";
import { GiHospitalCross } from "react-icons/gi";
import { SiHiveBlockchain } from "react-icons/si";
import Images from "@/shared/assets/images";

const images = [
  {
    id: 1,
    type: "Chest X-Ray",
    date: "May 15, 2024",
    hospital: "A Hospital",
    patientName: "John Doe",
    DateTimeOfExamination: "May 15, 2024",
    diagnosisReports: [],
    imageUrl:
      "https://images.unsplash.com/photo-1616012480717-fd9867059ca0?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    uploaded: false,
  },
  {
    id: 2,
    type: "Teeth X-Ray",
    date: "April 15, 2024",
    hospital: "B Hospital",
    patientName: "Nick Jo",
    DateTimeOfExamination: "April 15, 2024",
    diagnosisReports: [
      {
        aiName: "Diagnosys AI",
        report:
          "The scan shows no evidence of acute hemorrhage, mass effect, or midline shift. No abnormalities are observed in the parenchymal structures....",
        logoUrl: Images.DiagnosysAILogo,
      },
      {
        aiName: "MediScan AI",
        report:
          "The scan shows no evidence of acute hemorrhage, mass effect, or midline shift. No abnormalities are observed in the parenchymal structures....",
        logoUrl: Images.MediScanAILogo,
      },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1522849696084-818b29dfe210?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    uploaded: true,
  },
  // 추가 이미지 데이터...
];

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const image = images.find((img) => img.id === parseInt(id || "", 10));

  if (!image) {
    return <div>Image not found</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <PageHeader title={image.type} />
      <img
        src={image.imageUrl}
        alt={image.type}
        className="w-full h-auto rounded-3xl"
      />
      <div>
        <Typography.H4>{image.type} Diagnostic Report</Typography.H4>
        <Typography.P className="mt-2">
          Patient Name: <span className="font-bold">{image.patientName}</span>
          <br />
          Examination Date:{" "}
          <span className="font-bold">{image.DateTimeOfExamination}</span>
        </Typography.P>
      </div>
      <div className="">
        <Typography.H4>AI Diagnosis</Typography.H4>
        {image.diagnosisReports.length > 0 ? (
          image.diagnosisReports.map((report, index) => (
            <Card key={index} className="rounded-3xl p-5 mt-4">
              <div className="flex items-center gap-2">
                <div className=" flex-1">
                  <div className=" flex flex-row items-center gap-4">
                    <img
                      src={report.logoUrl}
                      alt={report.aiName}
                      className="w-8 h-8 rounded-full"
                    />{" "}
                    <Typography.Large>{report.aiName}</Typography.Large>
                  </div>
                  <Typography.P className="mt-2 line-clamp-3">
                    {report.report}
                  </Typography.P>
                </div>
                <IoChevronForwardOutline className="w-6 h-6" />
              </div>
            </Card>
          ))
        ) : (
          <Typography.P className="mt-2">Image not uploaded</Typography.P>
        )}
      </div>
      <Button
        variant={image.uploaded ? "outline" : "default"}
        className="w-full mt-4 rounded-full h-14"
      >
        {image.uploaded ? (
          <div className="flex flex-row items-center gap-2">
            <GiHospitalCross className="w-5 h-5" />
            Request AI Secondary Opinion
          </div>
        ) : (
          <div className="flex flex-row items-center gap-2">
            <SiHiveBlockchain className="w-5 h-5" />
            Register on Blockchain
          </div>
        )}
      </Button>
    </div>
  );
};

export default DetailPage;
