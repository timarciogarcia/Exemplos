import {FaFacebook, FaInstagram, FaLinkedin} from 'react-icons/fa'
import {FaHospitalSymbol} from 'react-icons/fa';

import styles from "./Footer.module.css"

function Footer() {
    return ( 
        <footer className={styles.footer}>
            <ul className={styles.sociallist}>
                <li className={styles.sociallist}>
                    <FaFacebook />
                </li>
                <li className={styles.sociallist}>
                    <FaInstagram />
                </li>
                <li className={styles.sociallist}>
                    <FaLinkedin />
                </li>
            </ul>
            <p className={styles.copyrigth}>
                <span><FaHospitalSymbol/>Pet</span> &copy; - 2022</p>
        </footer>
    );
}

export default Footer;