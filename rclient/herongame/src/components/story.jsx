import {useState, useRef, useEffect} from 'react';

import InkController from './storycontroller'
import storycontent from '../assets/sorttest'
console.log(storycontent);

function StoryPage({ sendVar, onIncomingVar}){
    const controllerRef = useRef(null);
    const [paragraphs, setParagraphs] = useState([]);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        try{

            controllerRef.current = new InkController(storycontent, sendVar,
            {onParagraph: (text) => setParagraphs(prev => [...prev, text]),
            onAnswer: (c) => setAnswers(c),
            });

            controllerRef.current.tracking();

            controllerRef.current.advance();

        }catch (err){
            console.error('real error: ', err);
        }
    }, []);
    useEffect(() => {
        const repeat = onIncomingVar((varname, value) =>{
            controllerRef.current?.localvariablechange(varname, value);
        });
        return repeat;
    }, [onIncomingVar]);
    
    
    return(<>
            <div id="storyContainer">
                {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                {answers.map((c, i) => (<button key={i} onClick={() => controllerRef.current.choose(i)}>{c.text}</button>))}
            </div>
        </>
    );
}

export default StoryPage;