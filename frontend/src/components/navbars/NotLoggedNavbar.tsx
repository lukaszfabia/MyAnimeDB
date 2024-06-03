import { Nav, Dropdown, DropdownToggle, DropdownMenu } from "react-bootstrap";
import {
  faSignIn,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./toggler.module.css";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons/faUserCircle";

export default function NotLoggedNavbar() {
  return (
    <Nav.Item className="ms-2 mt-3 mt-lg-auto">
      <Dropdown>
        <DropdownToggle className={styles.togglerIcon}>
          <FontAwesomeIcon icon={faUserCircle} />
          <DropdownMenu className={styles.toggler} align="end">
            <Dropdown.Item href="/login">
              <FontAwesomeIcon icon={faSignIn} /> login
            </Dropdown.Item>
            <Dropdown.Item href="/register">
              <FontAwesomeIcon icon={faUserPlus} />
              {"  "}register
            </Dropdown.Item>
          </DropdownMenu>
        </DropdownToggle>
      </Dropdown>
    </Nav.Item>
  );
}
