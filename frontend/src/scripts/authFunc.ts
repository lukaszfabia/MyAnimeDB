import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/const";
import api from "./api";

/**
 * Registers a new user.
 * 
 * @param e - The event object.
 * @param navigate - A function to navigate to a different path.
 */
export const register = async (e: any, navigate: (path: string) => void) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("user.username", e.target.username.value);
    formData.append("user.email", e.target.email.value);
    formData.append("user.password", e.target.password.value);
    if (e.target.avatar.files[0] !== undefined) {
        formData.append("avatar", e.target.avatar.files[0]);
    }
    formData.append("bio", "change me");

    await api
        .post("/api/auth/register/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            console.log(response);
            login(e, false, navigate);
        })
        .catch((error) => {
            console.log(error);
            alert("username or email already exists");
            window.location.reload();
        });
};


/**
 * Logs in the user with the provided credentials.
 * @param elem - The event object representing the form submission.
 * @param rememberMe - A boolean indicating whether to remember the user's login.
 * @param navigate - A function to navigate to a specific path.
 */
export const login = async (elem: any, rememberMe: boolean, navigate: (path: string) => void) => {
    elem.preventDefault()
    await api.post("/api/auth/token/", {
        username: elem.target.username.value,
        password: elem.target.password.value,
    }).then((response) => {
        if (response.status !== 200) {
            alert("Invalid credentials");
            return;
        } else {
            if (rememberMe) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                localStorage.setItem("isLogged", "true");
                localStorage.setItem("username", elem.target.username.value);
            } else {
                sessionStorage.setItem(ACCESS_TOKEN, response.data.access);
                sessionStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                sessionStorage.setItem("isLogged", "true");
                sessionStorage.setItem("username", elem.target.username.value);
            }
            navigate(`/profile/${elem.target.username.value}`);
        }
    }
    ).catch((error) => {
        alert("Wrong login or password!")
        console.log(error);
        return;
    });
}

/**
 * Updates the user profile with the provided form data.
 * @param e - The event object.
 * @param navigate - A function to navigate to a different path.
 */
export const updateProfile = async (e: any, navigate: (path: string) => void) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const bio = e.target.bio.value;

    const formData = new FormData();

    const userFields = { "user.username": username, "user.email": email, "user.password": password };
    const otherFields = { bio: bio };

    Object.entries({ ...userFields, ...otherFields }).forEach(([key, value]) => {
        if (value !== "") {
            formData.append(key, value);
        }
    });

    if (e.target.avatar.files.length > 0) {
        formData.append("avatar", e.target.avatar.files[0]);
    }

    await api
        .put("/api/auth/settings/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then((response) => {
            // logout cuz of token change
            if (response.status === 200) {
                localStorage.clear();
                sessionStorage.clear();
                navigate("/login");
            } else {
                alert("Username already exists!");
                return;
            }
        })
        .catch((error) => {
            console.log(error);
            alert("username already exists");
            window.location.reload();
        });
}

/**
 * Updates the rating and status of an anime.
 * 
 * @param e - The event object.
 * @param animeId - The ID of the anime.
 * @param navigate - A function to navigate to a different path.
 */
export const updateRating = async (e: any, animeId: number, navigate: (path: string) => void) => {
    e.preventDefault();
    const rating = e.target.rating.value;
    const status = e.target.status.value;

    const data = {
        rating: rating,
        status: status,
    };

    await api
        .put(`/api/anime/${animeId}/`, data)
        .then((response) => {
            console.log(response);
            navigate(`/anime/${animeId}`);
        })
        .catch((error) => {
            console.log(error);
        });
}



