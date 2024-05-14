import api from "../scripts/api"

export default function MySettings() {
    const res = api.get("/api/user/settings/").then((res) => {
        console.log(res.data)
    }).catch((err) => {
        console.log(err)
    });


    return (
        <div>
            <h1>Settings</h1>
        </div>
    )
}
