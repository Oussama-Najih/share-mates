import Link from "next/link";

type OptionsProps = {
  options: {
    name: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    href: string;
  }[];
};

export default function Options({ options }: OptionsProps) {
  return (
    <div className="min-h-screen py-10 flex justify-center items-center bg-background ">
      <div className="w-9/12 grid grid-cols-2 grid-rows-7 gap-2 max-w-screen-sm">
        {options.map(({ name, icon: Icon, href }) => (
          <Link key={name} href={href} passHref>
            <div className="bg-muted group/subject hover:bg-muted/50 h-32 rounded-md flex flex-col justify-center items-center gap-2">
              <Icon className="w-10 h-10 text-primary group-hover/subject:scale-[118%] transition-transform duration-300" />
              <h1 className="text-center font-roboto text-card-foreground">
                {name}
              </h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
