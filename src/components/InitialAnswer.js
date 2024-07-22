const InitialAnswer = ({ onClickNext, currStep }) => {
    function handleOnClick() {
        console.log(`click: InitialAnswer ${currStep}`);
        onClickNext();
    }
    return (
        <div>
            <h1>InitialAnswer</h1>
            <button onClick={handleOnClick}>Next</button>
        </div>
    );
}
export default InitialAnswer;