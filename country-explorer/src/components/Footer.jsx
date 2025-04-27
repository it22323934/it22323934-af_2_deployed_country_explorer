import { Footer as FlowbiteFooter } from 'flowbite-react';
import { GlobeAltIcon } from '@heroicons/react/24/solid';

export default function Footer() {
  return (
    <FlowbiteFooter container className="rounded-none shadow-inner mt-10">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div className="mb-4">
          <GlobeAltIcon className="h-6 w-6 mr-3 text-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <FlowbiteFooter.Title title="Resources" />
              <FlowbiteFooter.LinkGroup col>
                <FlowbiteFooter.Link href="https://restcountries.com/">
                  REST Countries API
                </FlowbiteFooter.Link>
                <FlowbiteFooter.Link href="https://flowbite.com/">
                  Flowbite
                </FlowbiteFooter.Link>
              </FlowbiteFooter.LinkGroup>
            </div>
            <div>
              <FlowbiteFooter.Title title="Follow us" />
              <FlowbiteFooter.LinkGroup col>
                <FlowbiteFooter.Link href="#">
                  Github
                </FlowbiteFooter.Link>
                <FlowbiteFooter.Link href="#">
                  Twitter
                </FlowbiteFooter.Link>
              </FlowbiteFooter.LinkGroup>
            </div>
            <div>
              <FlowbiteFooter.Title title="Legal" />
              <FlowbiteFooter.LinkGroup col>
                <FlowbiteFooter.Link href="#">
                  Privacy Policy
                </FlowbiteFooter.Link>
                <FlowbiteFooter.Link href="#">
                  Terms & Conditions
                </FlowbiteFooter.Link>
              </FlowbiteFooter.LinkGroup>
            </div>
          </div>
        </div>
        <FlowbiteFooter.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FlowbiteFooter.Copyright href="#" by="Country Explorer" year={2024} />
        </div>
      </div>
    </FlowbiteFooter>
  );
}