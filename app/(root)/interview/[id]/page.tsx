import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewById } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';

const Page = async( {params}: RouteParams) => {
    const {id} = await params;
    const user = await getCurrentUser();
    const interview = await getInterviewById(id);

    if(!interview) redirect('/')

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold capitalize">{interview.role} Interview</h2>
            <span className="bg-dark-200 px-4 py-2 rounded-lg text-sm font-medium capitalize w-fit">
              {interview.type}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <Agent 
          userName={user?.name || ''}
          userId={user?.id}
          interviewId={id}
          type="interview"
          questions={interview.questions}
        />
      </div>
    </div>
  )
}

export default Page