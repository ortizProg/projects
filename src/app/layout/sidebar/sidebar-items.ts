import { ROLES } from '@shared/models/enums';
import { RouteInfo } from './sidebar.metadata';
export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard/main',
    title: 'Inicio',
    iconType: 'material-icons-outlined',
    icon: 'home',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    submenu: [],
    rolAuthority: [ROLES.ADMIN, ROLES.USER]
  },
  {
    path: '/pages/healt-centers',
    title: 'Gestión centros de salud',
    iconType: 'material-icons-outlined',
    icon: 'assessment',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    submenu: [],
    rolAuthority: [ROLES.ADMIN]
  },
  {
    path: '/pages/users',
    title: 'Gestión de usuarios',
    iconType: 'material-icons-outlined',
    icon: 'assessment',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    submenu: [],
    rolAuthority: [ROLES.ADMIN, ROLES.ADMIN_HEALT_CENTER]
  },
  {
    path: '/pages/clinical-histories',
    title: 'Gestión historias clinicas',
    iconType: 'material-icons-outlined',
    icon: 'assessment',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    submenu: [],
    rolAuthority: [ROLES.ADMIN, ROLES.USER, ROLES.ADMIN_HEALT_CENTER]
  },
];
