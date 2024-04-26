import {
  Nav,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "react-bootstrap";
import {
  faCog,
  faList,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Remove the import statement for styles
// import { styles } from "./navbar.css";
import styles from "../navbars/toggler.module.css";

export default function LoggedNavbar() {
  return (
    <Nav.Item className="ms-2 mt-3 mt-lg-auto">
      <Dropdown>
        <DropdownToggle className={styles.togglerIcon}>
          <FontAwesomeIcon icon={faUser} />
          {/* name of profile */}
          <DropdownMenu className={styles.toggler} align="end">
            <Dropdown.Item href="/profile">
              <FontAwesomeIcon icon={faUser} /> profile
            </Dropdown.Item>
            <Dropdown.Item href="/profile/mylist">
              <FontAwesomeIcon icon={faList} /> my list
            </Dropdown.Item>
            <Dropdown.Item href="/profile/settings">
              <FontAwesomeIcon icon={faCog} /> settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/logout">
              <FontAwesomeIcon icon={faSignOut} /> logout
            </Dropdown.Item>
          </DropdownMenu>
        </DropdownToggle>
      </Dropdown>
    </Nav.Item>
  );
}
