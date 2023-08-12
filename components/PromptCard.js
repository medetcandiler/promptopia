'use client'
import Image from "next/image"
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from "next/navigation";

const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {
  const [copy, setCopy] = useState('');
  const { data: session } = useSession();
  const pathName = usePathname();
  const { push } = useRouter();

  const handleCopy = () => {
    setCopy(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopy(''), 3000)
  }

  const handleProfileClick = (post) => {
    if (session?.user.email === post.creator.email) {
      push('/profile')
    } else {
      push(`/profile?id=${post.creator._id}`)
    }
  }

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div onClick={() => handleProfileClick(post)} className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
          <Image
            src={post.creator.image}
            alt='user_image'
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900">{post.creator.username}</h3>
            <p className="font-inter text-sm text-gray-500">{post.creator.email}</p>
          </div>
        </div>

        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={copy === post.prompt ? '/assets/icons/tick.svg' : '/assets/icons/copy.svg'}
            width={12}
            height={12}
            alt="copy_btn"
          />
        </div>
      </div>

      <p className="my-4 font-satoshi text-sm text-gray-700">{post.prompt}</p>
      <p onClick={() => handleTagClick && handleTagClick(post.tag)} className="font_inter text-sm blue_gradient cursor-pointer">{post.tag}</p>

      {session?.user.id === post.creator._id && pathName === '/profile' && (
        <div className="mt-5 flex-center gap-4 border-t border-gary-100 pt-3">
          <p onClick={handleEdit} className="font-inter text-sm green_gradient cursor-pointer">Edit</p>
          <p onClick={handleDelete} className="font-inter text-sm orange_gradient cursor-pointer">Delete</p>

        </div>
      )}
    </div>
  )
}

export default PromptCard
