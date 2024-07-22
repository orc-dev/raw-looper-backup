import { CONJECTURE_LIST } from "../constants/experimentMeta";
import { useApplicationContext } from "../contexts/ApplicationContext";

const ReadConjecuture = ({ onClickNext, currStep }) => {
    const {shuffled_seq} = useApplicationContext();

    function handleOnClick() {
        console.log(`click: ReadConjecuture ${currStep}`);
        onClickNext();
    }
    return (
        <div>
            <h1>ReadConjecuture</h1>
            <button onClick={handleOnClick}>Next</button>
            <p>{CONJECTURE_LIST[shuffled_seq[currStep]].text}</p>
        </div>
    );
}
export default ReadConjecuture;