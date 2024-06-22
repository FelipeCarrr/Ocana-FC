import { useState } from "react";
import Sidebar from "../DashboardComponents/Sidebar";
import AllNewsDashboard from "../NoticiasDashboard/AllNewsDashboard";
import AllPlayersDashboard from "../PlayersDashboard/AllPlayersDashboard";
import AllGaleryDashboard from "../GalleryDashboard/AllGalleryDashboard";
import AllStaffDashboard from "../StaffDashboard/AllStaffDashboard";
import AllEventsDashboard from "../EventsDashboard/AllEventsDashboard";
import LiveStreamDashboard from "../StreamDashBoard/LiveStreamDashboard";

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState("news");

  const handleSelectSection = (section) => {
    setSelectedSection(section);
  };

  const renderSection = () => {
    switch (selectedSection) {
      case "news":
        return <AllNewsDashboard />;
      case "players20":
        return <AllPlayersDashboard />;
      case "gallery":
        return <AllGaleryDashboard />;
      case "staff":
        return <AllStaffDashboard />;
      case "events":
        return <AllEventsDashboard />;
      case "stream":
        return <LiveStreamDashboard />;
      default:
        return <AllNewsDashboard />;
    }
  };

  return (
    <div className="flex">
      <Sidebar onSelect={handleSelectSection} />
      <main className="p-4 sm:ml-64">
        <div className="m-6">{renderSection()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
