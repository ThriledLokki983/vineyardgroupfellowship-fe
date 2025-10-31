import * as Icons from '../../assets/icons/icons';


const Icon = ({ name, ...props }) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    //TODO: Instead of returning null - we can have a default icon that we can return here but first
    // Check this with Koen before doing that.
    return null;
  }

  return <IconComponent {...props} aria-hidden="true" />;
};

export default Icon;
