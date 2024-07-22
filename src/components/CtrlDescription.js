const CtrlDescription = ({ onClickNext, currStep }) => {
    function handleOnClick() {
        console.log(`click from CtrlDescription ${currStep}`);
        onClickNext();
    }
    return (
        <div>
            <h1>CtrlDescription</h1>
            <button onClick={handleOnClick}>Next</button>
        </div>
    );
}
export default CtrlDescription;