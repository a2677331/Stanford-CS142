import React from 'react';
import "./Header.css";

/**
 * Component that displays a personalized header at the top of a view
 */
class Header extends React.Component {
    render() {
        return (
        <header className="react-header-styles">
            <h1>🙋🏻‍♂️  Jian Zhong </h1>
            <p>Interested in App Development, Cybersecurity</p>
            <p>Email: zhongjian089@gmail.com</p>
        </header>
        );
    }
}


export default Header;