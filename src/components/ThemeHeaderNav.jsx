import { getThemeMenu } from "../lib/wpgraphql";
import ThemeHeaderNavClient from "./ThemeHeaderNavClient";

export default async function ThemeHeaderNav() {
	const { headerItems, modalItems } = await getThemeMenu();

	return <ThemeHeaderNavClient menuItems={headerItems} modalMenuItems={modalItems} />;
}
