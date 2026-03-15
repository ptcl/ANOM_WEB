import React from 'react'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer'
import { Button } from '../ui/button'
import { SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '../ui/sidebar'
import { NavUser } from './sidebar-component/nav-user'
import NavUtils from './sidebar-component/nav-utils'
import { useTranslations } from 'next-intl'
import { NavCollapsibleSection } from './sidebar-component/nav-collapsible-section'
import { navMain } from '@/types/sidebarInfo'

export default function MenuMobile() {
    const t = useTranslations();
    return (
        <>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline" className='w-full'>{t('commun.buttons.OpenMenu')}</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle></DrawerTitle>
                        </DrawerHeader>
                        <SidebarHeader>
                            <NavUser />
                        </SidebarHeader>
                        <SidebarContent>
                            <NavCollapsibleSection items={navMain} />
                            {/* <NavProjects projects={data.projects} /> */}
                        </SidebarContent>
                        <SidebarFooter>
                            <NavUtils />
                        </SidebarFooter>
                        <SidebarRail />
                        <DrawerFooter>

                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>

        </>
    )
}
function useTranslation() {
    throw new Error('Function not implemented.')
}

