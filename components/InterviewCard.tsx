import dayjs from 'dayjs'; //for date


const InterviewCard = ({ interviewId, userId, role, type, techstack, createdAt}: InterviewCardProps ) => {
    const feedback = null as Feedback | null; //feedbacks initially set to null
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type; //for non-tehncial says mix
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY')
  return (
    <div className = "card-border w-[360px] max-sm:w-full min-h-96">
        <div className = "card-interview">
            <div>
                <div className = "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
                    <p className = "badge-text">{normalizedType}</p>
                </div>
                
            </div>

        </div>
    </div>
  )
}

export default InterviewCard