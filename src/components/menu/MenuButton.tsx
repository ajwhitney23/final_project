import * as React from "react";

interface MenuButtonProps {
    handleMouseDown: (e: any) => void // Probably really bad (but it works)
}

const MenuButton = ({
    handleMouseDown
}: MenuButtonProps): JSX.Element => {
    return (
        <>
            <button id="roundButton"
                onMouseDown={handleMouseDown}></button>
        </>
    );
};

/*class MenuButton extends Component {
    render() {
        return (
            <button id="roundButton"
                onMouseDown={this.props.handleMouseDown}></button>
        );
    }
}*/

export default MenuButton;