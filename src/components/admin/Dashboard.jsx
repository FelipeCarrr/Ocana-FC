import { useState } from "react";
import Sidebar from "../DashboardComponents/Sidebar";
import AllNewsDashboard from "../NoticiasDashboard/AllNewsDashboard";
import AllPlayersDashboard from "../PlayersDashboard/AllPlayersDashboard";
import AllGaleryDashboard from "../GalleryDashboard/AllGalleryDashboard";

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
        return <AllPlayersDashboard/>;
      case "gallery":
        return <AllGaleryDashboard/>;
      case "staff":
        return <div>Registar Staff</div>;
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
