import { jwtDecode } from 'jwt-decode';
export default function getDecodedUsername() {
    const token = localStorage.getItem('access_token');
    if (token !== null) {
        const decoded: any = jwtDecode;
        const decodedToken = decoded(token);
        return decodedToken.username;
    }
    return '';
}