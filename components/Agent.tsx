import Image from 'next/image'

enum CallStatus{
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const Agent = ({userName}: AgentProps) => {
    const isSpeaking = true;

  return (
    <>
        <div className = "call-view">
        <div className = "card-interviewer">
            <div className = "avatar">
                <Image src = "/logo-icon.png" alt = "vapiai" width = {65} height = {54} className = "object-cover" />
                {isSpeaking && <span className = "animate-speak"/>}
            </div>
            <h3>AI Interviewer</h3>
        </div>
        <div className = "card-border">
            <div className = "card-content">
                <Image src = "/user-icon.png" alt = "user pfp" width = {540} height = {540} className = "rounded-full object-cover size-[120px]"/>
                <h3>{userName}</h3>
            </div>
        </div>
    </div>
        <div className = "w-full flex justify-center">
                { CallStatus !== 'ACTIVE' ? (
                    <button>
                        <span>
                            {CallStatus === 'INACTIVE' || CallStatus === 'FINISHED' ? 'Call' : '...'}
                        </span>
                    </button>
                ): (
                    <button className = "btn-disconnect">
                        End
                    </button>
                )}
        </div>
    </>
    
  )
}

export default Agent