import { AppLoader, AppIcon } from "../Index";

const AppButton = function (props: any) {
  const {
    disabled = false,
    size,
    variant,
    href,
    to,
    target,
    loading,
    icon,
    text,
    classColor,
    color = "yellow",
    ...extraProps
  } = props;

  const tag = () => {
    if (href) return "a";
    if (to) return "router-link"; // Assuming you are using React Router
    return "button";
  };

  const classBtn = () => {
    let sizeClass = `py-1 px-2 text-sm`;
    if (size === "md") {
      sizeClass = `py-2 px-2 text-sm`;
    } else if (size === "sm") {
      sizeClass = `py-1.5 px-2 text-xs md:text-sm`;
    } else if (size === "lg") {
      sizeClass = `py-3 px-5 text-sm`;
    }

    let colorClass = "";
    if (disabled) colorClass = " bg-gray-100 text-gray-500 cursor-not-allowed	 ";
    else {
      if (classColor) colorClass = classColor;
      else if (variant === "primary") {
        colorClass = ` border-transparent  `;
      } else if (variant === "secondary") {
        colorClass =
          " text-stone-500 border-stone-300 dark:border-stone-700 border-2 ";
      } else if (variant === "third") {
        colorClass =
          "text-black border-black rounded-none border-none hover:bg-gray-100 black-icon";
      } else if (variant === "neutral") {
        colorClass =
          "text-gray-500 bg-neutral-200 hover:bg-neutral-300 border-transparent";
      }

      if (variant === "primary") {
        colorClass =
          " border-black bg-black dark:text-black dark:bg-white dark:hover:bg-stone-200 hover:bg-black text-white ";
      } else if (color == "green" && variant === "primary") {
        colorClass =
          " border-green-300 bg-green-300 hover:bg-green-500 text-green-900 ";
      }
    }

    return `${sizeClass} ${colorClass} appearance-none rounded-lg md:rounded-lg inline-block focus:outline-none  font-base   ${extraProps.className}`;
  };

  const propsComputed = () => {
    const propsObj: any = { type: props.type || "button" };
    if (href) propsObj.href = href;
    if (to) propsObj.to = to; // Assuming you are using React Router
    return propsObj;
  };

  return (
    <>
      {tag() === "button" && (
        <button
          className={`${classBtn()}   ${!disabled ? "scale-hover" : ""} ${
            disabled ? "disabled" : ""
          }`}
          target={target}
          {...propsComputed()}
          onClick={props.onClick}
          disabled={disabled}
        >
          {text && (
            <span>
              <div className="flex justify-center items-center gap-2">
                {icon && (
                  <div style={{ flexShrink: 0 }} className="icon-btn">
                    {loading ? (
                      <div className="mx-auto">
                        <AppLoader size="sm" />
                      </div>
                    ) : (
                      <div className={"h-4 md:h-4 w-4 icon-btn " + variant}>
                        <AppIcon icon={icon} className="w-full h-full" />
                      </div>
                    )}
                  </div>
                )}
                <span>{text}</span>
              </div>
            </span>
          )}
          {!text && props.children} {/* Render the slot content */}
        </button>
      )}
      {tag() === "a" && (
        <a
          className={`${classBtn()}  ${!disabled ? "scale-hover" : ""} ${
            disabled ? "disabled" : ""
          }`}
          target={target}
          {...propsComputed()}
          onClick={props.onClick}
        >
          {text && (
            <span>
              <div className="flex justify-center items-center gap-2">
                <div style={{ flexShrink: 0 }} className="icon-btn">
                  {loading ? (
                    <div className="mx-auto">
                      <AppLoader size="sm" />
                    </div>
                  ) : icon ? (
                    <div className={"h-4 md:h-4 w-4 icon-btn " + variant}>
                      <AppIcon icon={icon} />
                    </div>
                  ) : null}
                </div>
                <span>{text}</span>
              </div>
            </span>
          )}
          {!text && props.children}
        </a>
      )}
    </>
  );
};

// AppButton.propTypes = {
//   disabled: PropTypes.bool,
//   size: PropTypes.string,
//   variant: PropTypes.string,
//   href: PropTypes.string,
//   to: PropTypes.object,
//   target: PropTypes.string,
//   loading: PropTypes.bool,
//   icon: PropTypes.string,
//   text: PropTypes.string,
//   classColor: PropTypes.string,
// };

export default AppButton;
