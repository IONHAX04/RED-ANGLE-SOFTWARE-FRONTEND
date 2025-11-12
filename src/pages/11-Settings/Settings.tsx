import React, { useState } from "react";
import "./Settings.css";
import SecondaryHeader from "../../components/02-SecondaryHeader/SecondaryHeader";
import { FolderPlus, SquareLibrary, Users } from "lucide-react";
import { Dialog } from "primereact/dialog";
import Package from "../../components/11-Settings/Package";
import UserSettings from "../../components/11-Settings/Users";
import Addons from "../../components/11-Settings/Addons";
// import Quotations from "../../components/11-Settings/Quotations";

const Settings: React.FC = () => {
  const [showPackagesModal, setShowPackagesModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showAddOnsModal, setShowAddOnsModal] = useState(false); // 👈 New state
  // const [showQuotationsModel, setShowQuotationsModel] = useState(false);

  return (
    <div>
      <SecondaryHeader title="Settings" />
      <div className="flex mt-3 gap-3 flex-wrap">
        {/* Packages */}
        <div className="flex-1">
          <div
            className="cardContents"
            onClick={() => setShowPackagesModal(true)}
            style={{ cursor: "pointer" }}
          >
            <SquareLibrary size={100} />
            <p>Packages</p>
          </div>
        </div>

        {/* Users */}
        <div className="flex-1">
          <div
            className="cardContents"
            onClick={() => setShowUsersModal(true)}
            style={{ cursor: "pointer" }}
          >
            <Users size={100} />
            <p>User Roles</p>
          </div>
        </div>

        {/* Add Ons */}
        <div className="flex-1">
          <div
            className="cardContents"
            onClick={() => setShowAddOnsModal(true)}
            style={{ cursor: "pointer" }}
          >
            <FolderPlus size={100} />
            <p>Add Ons</p>
          </div>
        </div>

        {/* (Optional) Empty placeholders */}
        <div className="flex-1">
          {/* <div
            className="cardContents"
            onClick={() => setShowQuotationsModel(true)}
            style={{ cursor: "pointer" }}
          >
            <BookMarked size={100} />
            <p>Quotations</p>
          </div> */}
        </div>
        <div className="flex-1"></div>
        <div className="flex-1"></div>
      </div>

      {/* Packages Modal */}
      <Dialog
        header="Manage Packages"
        visible={showPackagesModal}
        onHide={() => setShowPackagesModal(false)}
        style={{ width: "95vw", height: "90vh" }}
        dismissableMask
        modal
      >
        <Package />
      </Dialog>

      {/* Users Modal */}
      <Dialog
        header="User Roles"
        visible={showUsersModal}
        onHide={() => setShowUsersModal(false)}
        style={{ width: "95vw", height: "90vh" }}
        dismissableMask
        modal
      >
        <UserSettings />
      </Dialog>

      {/* Add Ons Modal */}
      {/* <Dialog
        header="Add Quotations"
        visible={showQuotationsModel}
        onHide={() => setShowQuotationsModel(false)}
        style={{ width: "95vw", height: "90vh" }}
        dismissableMask
        modal
      >
        <Quotations />
      </Dialog> */}

      <Dialog
        header="Manage Add Ons"
        visible={showAddOnsModal}
        onHide={() => setShowAddOnsModal(false)}
        style={{ width: "95vw", height: "90vh" }}
        dismissableMask
        modal
      >
        <Addons />
      </Dialog>
    </div>
  );
};

export default Settings;
