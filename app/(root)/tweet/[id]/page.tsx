import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import Comment from "@/components/forms/Comment";
import tweetCard from "@/components/cards/tweetCard";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchtweetById } from "@/lib/actions/tweet.actions";

export const revalidate = 0;

async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const tweet = await fetchtweetById(params.id);

  return (
    <section className='relative'>
      <div>
        <tweetCard
          id={tweet._id}
          currentUserId={user.id}
          parentId={tweet.parentId}
          content={tweet.text}
          author={tweet.author}
          community={tweet.community}
          createdAt={tweet.createdAt}
          comments={tweet.children}
        />
      </div>

      <div className='mt-7'>
        <Comment
          tweetId={params.id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className='mt-10'>
        {tweet.children.map((childItem: any) => (
          <tweetCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}

export default page;
