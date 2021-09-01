import React, {Component} from 'react';
import Link from 'next/Link';

interface OffcanvasProps {
    slug?: string
}
interface INavItems {
    href: string;
    name: string;
}

class Offcanvas extends Component<OffcanvasProps> {
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
            <div className="offcanvas offcanvas-start w-auto" id="offcanvasNavbar"
                 aria-labelledby="offcanvasNavbarLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title me-5" id="offcanvasNavbarLabel">Performance select</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <ul className="navbar-nav nav-pills justify-content-end flex-grow-1 pe-3">
                        {this.navItems.map((navItem, index) => (
                            <li className="nav-item mb-2" key={index}>
                                <Link href={{
                                    pathname: '/[slug]',
                                    query: { slug: navItem.href },
                                }}>
                                    <a className={`nav-link text-center ${this.props.slug === navItem.href ? 'active' : ''}`} aria-current="page">{navItem.name}</a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Offcanvas;
