import { Topbar } from "@/components/layout/topbar";
import { ReportSummaryCards } from "@/components/bao-cao/report-summary-cards";

export default async function ReportsPage() {
  return (
    <>
      <Topbar
        title="Bao cao"
        description="Tong hop tinh hinh su dung, trang thai va chi phi van hanh thiet bi."
      />
      <ReportSummaryCards />
    </>
  );
}
