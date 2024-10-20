"use client";
import Image from "next/image";
import headerIcon from "../assets/header-icon.png";
import headerText from "../assets/header-text.png";
import Link from "next/link";
// 모든 페이지의 적용되는 header 컴포넌트
const Header = () => {
    return (
        <header className="mt-4">
            <Link href={"/"}>
                <div className="flex cursor-pointer">
                    <Image src={headerIcon} alt="header-icon" />
                    <Image src={headerText} alt="header-text" className="hidden tablet:block desktop:block"></Image>
                </div>
            </Link>
        </header>
    );
};
export default Header;
