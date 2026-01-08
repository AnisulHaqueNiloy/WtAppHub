import { Outlet } from "react-router-dom";

function ParentLayout() {
  return (
    <div>
      <Outlet></Outlet>
    </div>
  );
}

export default ParentLayout;
