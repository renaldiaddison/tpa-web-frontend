import React from 'react'

const UserSuggestionProfile = ({ userSuggestionData } : any) => {
    return (
        <>
            {
                userSuggestionData.map((userSuggestionData : any) => {
                    return (<UserSuggestionProfile userSuggestionData={userSuggestionData} />)
                })
            }
        </>
    )
}

export default UserSuggestionProfile