import React, {Component} from 'react';
import {Dropdown as BSDropdown} from "react-bootstrap";

interface DropdownProps {
    slug?: string
}
interface INavItems {
    href: string;
    name: string;
}

class Dropdown extends Component<DropdownProps> {
    navItems: INavItems[];

    constructor(props) {
        super(props);
        this.navItems = [
            {
                href: '',
                name: '1 day performance'
            },
            {
                href: '1week',
                name: '1 week performance'
            },
            {
                href: '1month',
                name: '1 month performance'
            },
            {
                href: '3month',
                name: '3 month performance'
            },
            {
                href: '6month',
                name: '6 week performance'
            },
            {
                href: '1year',
                name: '1 year performance'
            },
        ]
    }

    render() {
        return (
            <BSDropdown className="ms-auto me-3">
                <BSDropdown.Toggle variant="outline-primary" id="dropdownPerformanceLink">
                    Performance select
                </BSDropdown.Toggle>
                <BSDropdown.Menu>
                    {this.navItems.map((navItem, index) => (
                        <BSDropdown.Item
                            key={index}
                            href={`/${navItem.href}`}
                            active={this.props.slug === navItem.href}
                        >
                            {navItem.name}
                        </BSDropdown.Item>
                    ))}
                </BSDropdown.Menu>
            </BSDropdown>
        );
    }
}

export default Dropdown;
