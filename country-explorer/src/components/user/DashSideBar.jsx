import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiHeart,
  HiHome,
  HiChartPie
} from "react-icons/hi";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../../redux/user/userSlice";
import { signOutUser } from "../../service/authService";
import { toast } from "react-toastify";

export default function DashSideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState("");
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      await signOutUser();
      dispatch(signOutSuccess());
      navigate('/');
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };
  
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/">
            <Sidebar.Item
              icon={HiHome}
              as="div"
            >
              Home
            </Sidebar.Item>
          </Link>
          
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          
          <Link to="/favorites">
            <Sidebar.Item
              icon={HiHeart}
              as="div"
            >
              Favorites
            </Sidebar.Item>
          </Link>
          
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}