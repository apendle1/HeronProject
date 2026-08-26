

function StoryPage({controllerRef, paragraphs, answers}){
    
    return(<>
            <div id="storyContainer">
                {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                {answers.map((c, i) => (<button key={i} onClick={() => controllerRef.current.choose(i)}>{c.text}</button>))}
            </div>
        </>
    );
}

export default StoryPage;