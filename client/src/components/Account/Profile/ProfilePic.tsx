import React from 'react'

type Props = {}

function ProfilePic({}: Props) {
  return (
    <img alt="" className="w-24 h-24 border rounded-full dark:bg-gray-500 dark:border-gray-700" src="https://source.unsplash.com/40x40/?portrait?1" />
  )
}

export default ProfilePic;