import { Form, Link, NavLink } from "@remix-run/react";
import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { ModeToggle } from "./mode-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Logo } from "./Logo";
import { CourseCategory } from "@/config/constant";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function UserMenu() {
  const { user } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end">
        <DropdownMenuLabel className="flex items-start gap-6">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <strong>{user?.fullName}</strong>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link to="/my-courses" className="w-full">
              My learning
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/cart" className="w-full">
              My cart
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/wishlist" className="w-full">
              Wishlist
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link to="/notifications" className="w-full">
              Notifications
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/messages" className="w-full">
              Messages
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link to="/edit-account" className="w-full">
              Account Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/purchase-history" className="w-full">
              Purchase history
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link to="/support" target="_blank" className="w-full">
              Help and support
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button className="w-full" variant="link">
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const { isLoggedIn } = useAuth();
  return (
    <MaxWidthWrapper
      as="header"
      className="py-5 shadow-md dark:border-b dark:shadow-none"
    >
      <div className="flex items-center gap-4">
        <Logo />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="scrollbar-thin grid max-h-72 gap-3 overflow-auto p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  {Object.values(CourseCategory).map((category) => (
                    <li key={category}>
                      <NavLink
                        to={`/courses/${category
                          .toLocaleLowerCase()
                          .replaceAll(" ", "-")}`}
                        className="hover:text-primary"
                      >
                        {category}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Form action="/search" className="w-full">
                <input
                  placeholder="Search"
                  name="q"
                  className="w-full rounded-md border border-black bg-transparent px-4 py-2 text-sm placeholder:text-sm focus:outline-none dark:border-white/40"
                />
              </Form>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto space-x-4">
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => cn(isActive && "text-primary")}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => cn(isActive && "text-primary")}
              >
                Register
              </NavLink>
              <ModeToggle />
            </>
          )}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
