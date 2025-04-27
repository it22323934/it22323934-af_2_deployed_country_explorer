import { useSelector, useDispatch } from "react-redux";
import { SunIcon, MoonIcon, GlobeAltIcon, UserIcon } from "@heroicons/react/24/solid";
import { Navbar as FlowbiteNavbar, Dropdown, Avatar, Button } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { signOutSuccess } from "../redux/user/userSlice";
import { signOutUser } from "../service/authService";
import { toast } from "react-toastify";

export default function Navbar() {
  const dispatch = useDispatch();
  const { theme } = useSelector(state => state.theme || { theme: 'light' });
  // Handle case where state.user might be undefined
  const userState = useSelector(state => state.user);
  const currentUser = userState ? userState.currentUser : null;
  const darkMode = theme === 'dark';
  
  // Get current location to determine active link
  const location = useLocation();
  const currentPath = location.pathname;
  
  const handleSignout = async () => {
    try {
      await signOutUser();
      dispatch(signOutSuccess());
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  return (
    <FlowbiteNavbar
      fluid
      className={`fixed w-full z-20 shadow-md py-3 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4">
        <FlowbiteNavbar.Brand as={Link} to="/" className="flex items-center space-x-3">
          <GlobeAltIcon className="h-7 w-7 text-blue-500" />
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            Country Explorer
          </span>
        </FlowbiteNavbar.Brand>

        <div className="flex items-center space-x-4 md:order-2">
          <ThemeToggle className="mr-1" />

          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar 
                  img={currentUser.profilePicture || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} 
                  rounded 
                  size="sm"
                  bordered
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm font-medium">@{currentUser.username}</span>
                <span className="block text-xs text-gray-500 truncate">{currentUser.email}</span>
              </Dropdown.Header>
              <Dropdown.Item as={Link} to="/dashboard?tab=profile">
                Profile
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/favorites">
                Favorites
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>
                Sign Out
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline size="sm">
                Sign In
              </Button>
            </Link>
          )}

          <Dropdown 
            label="Resources" 
            arrowIcon 
            className="ml-2"
            placement="bottom-end"
          >
            <Dropdown.Item as={Link} to="/favorites" className="px-4 py-2">
              Favorites
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/statistics" className="px-4 py-2">
              Statistics
            </Dropdown.Item>
            <Dropdown.Item
              as="a"
              href="https://restcountries.com/"
              target="_blank"
              className="px-4 py-2"
            >
              REST Countries API
            </Dropdown.Item>
          </Dropdown>

          <FlowbiteNavbar.Toggle className="ml-2 p-2" />
        </div>

        <FlowbiteNavbar.Collapse className="md:mx-4">
          <FlowbiteNavbar.Link 
            as={Link} 
            to="/" 
            active={currentPath === '/'}
            className="py-2 px-3 md:px-4 text-center"
          >
            Home
          </FlowbiteNavbar.Link>
          <FlowbiteNavbar.Link 
            as={Link} 
            to="/about"
            active={currentPath === '/about'}
            className="py-2 px-3 md:px-4 text-center" 
          >
            About
          </FlowbiteNavbar.Link>
          {!currentUser && (
            <FlowbiteNavbar.Link 
              as={Link} 
              to="/sign-up"
              active={currentPath === '/sign-up'}
              className="py-2 px-3 md:px-4 text-center" 
            >
              Register
            </FlowbiteNavbar.Link>
          )}
        </FlowbiteNavbar.Collapse>
      </div>
    </FlowbiteNavbar>
  );
}