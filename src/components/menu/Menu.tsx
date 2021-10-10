import * as React from "react";

interface MenuProps {
    handleMouseDown: (e: any) => void, // Probably really bad (but it works)
    menuVisibility: boolean
}

const Menu = ({
    handleMouseDown,
    menuVisibility
}: MenuProps): JSX.Element => {
    var visibility = "hide";

    if (menuVisibility) {
        visibility = "show";
    }

    return (
        <>
            <div id="flyoutMenu"
                onMouseDown={handleMouseDown}
                className={visibility}>
                <h2><a href="#">Characters</a></h2>
                <h2><a href="#">Weapons</a></h2>
                <h2><a href="#">Artifacts</a></h2>
            </div>
        </>
        
    );
};

/*class Menu extends Component {
    render() {
        var visibility = "hide";

        if (this.props.menuVisibility) {
            visibility = "show";
        }

        return (
            <div id="flyoutMenu"
                onMouseDown={this.props.handleMouseDown}
                className={visibility}>
                <h2><a href="#">Characters</a></h2>
                <h2><a href="#">Weapons</a></h2>
                <h2><a href="#">Artifacts</a></h2>
            </div>
        );
    }
}*/

export default Menu;