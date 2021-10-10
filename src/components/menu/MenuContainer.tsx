import * as React from "react";
import MenuButton from "./MenuButton";
import Menu from "./Menu";

const MenuContainer = (): JSX.Element => {

    const [visible, setVisible] = React.useState<boolean>(false);

    const handleMouseDown = (e) => { // This error means nothing
        toggleMenu();

        e.stopPropagation();
    }

    const toggleMenu = () => {
        setVisible(!visible);
    }

    handleMouseDown.bind(this);
    toggleMenu.bind(this);

    return (
        <>
            <div><MenuButton handleMouseDown={handleMouseDown} />
                <Menu handleMouseDown={handleMouseDown}
                    menuVisibility={visible} />
            </div>
        </>
    )
};

/*
class MenuContainer extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            visible: false
        };

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    handleMouseDown(e) {
        this.toggleMenu();

        e.stopPropagation();
    }

    toggleMenu() {
        this.setState({
            visible: !this.state.visible
        });
    }

    render() {
        return (
            <div><MenuButton handleMouseDown={this.handleMouseDown} />
                <Menu handleMouseDown={this.handleMouseDown}
                    menuVisibility={this.state.visible} />
            </div>
        );
    }
}*/

export default MenuContainer;