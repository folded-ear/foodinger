import * as React from "react";

export const Profile = ({currentUser}) => {
    return (
        <>
            {currentUser.imageUrl && <img
                src={currentUser.imageUrl}
                alt={currentUser.name}
                title="Holy moley, you're attractive!"
            />
            }
            <div className="profile-name">
                <h2>{currentUser.name}</h2>
                <p className="profile-email">{currentUser.email}</p>
            </div>
        </>
    )
}