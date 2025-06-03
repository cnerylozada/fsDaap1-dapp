import Link from "next/link";

export default async function Home() {
  return (
    <div className="p-4">
      <div className="mb-2">
        <Link
          href={"https://www.linkedin.com/in/cristian-nery-027b70180/"}
          target="_blank"
          className="underline text-blue-700"
        >
          Author: cristh nery web2/web3 developer
        </Link>
      </div>
      <div className="mb-2 p-2 border rounded-md">
        <div>About me:</div>
        <ul className="list-disc list-inside">
          <li>
            I'm a software developer with 6 years of experience. I’ve worked 4
            years in web2 using Next.js, TypeScript, React, React Native,
            Tailwind, NestJS, and Node.js as my main stack — and around 2 years
            in web3, focused on the Ethereum ecosystem using Thirdweb, Hardhat
            Ignition, Solidity, and on-chain AI agents.
          </li>
          <li>I'm comfortable developing for both mobile and web platforms.</li>
          <li>
            Regarding AI, I enjoy using n8n and am currently learning LangChain
            to build more advanced AI agents.
          </li>
          <li>
            In the blockchain space, I’m also exploring Rust and Solana to
            expand my skills beyond Ethereum.
          </li>
        </ul>
      </div>
      <div className="mb-4">
        <ul className="list-disc list-inside">
          <li>
            I have created 4 littlle projects to show a bit what I can build in
            blockchain / on-chain AI applications using solidity and hardhat as
            main stack
          </li>
          <li>My main coding rules: clean code and simplicity</li>
          <li>
            I would glad to reveice your feedback. You can find the smart
            contracts and dapp code in these repositories:
            <div>
              <div>
                <Link
                  href={"https://github.com/cnerylozada/fsDaap1-dapp"}
                  target="_blank"
                  className="font-bold"
                >
                  GITHUB: fsDaap1-dapp
                </Link>
              </div>
              <div>
                <Link
                  href={"https://github.com/cnerylozada/fsDapp1-contracts"}
                  target="_blank"
                  className="font-bold"
                >
                  GITHUB: fsDapp1-contracts
                </Link>
              </div>
              <div>
                <Link
                  href={"https://github.com/cnerylozada/fsDapp2-contracts"}
                  target="_blank"
                  className="font-bold"
                >
                  GITHUB: fsDapp2-contracts
                </Link>
              </div>
            </div>
          </li>
          <li>
            Stay tunned, upcomming projects wil be about: RWA, security and
            Solana
          </li>
        </ul>
      </div>
      <div className="space-y-4">
        <div>
          <Link href={"/classroom"} className="block p-2 border rounded-md">
            Classroom
          </Link>
        </div>
        <div>
          <Link href={"/fund-me"} className="block p-2 border rounded-md">
            FundMe
          </Link>
        </div>
        <div>
          <Link href={"/lottery"} className="block p-2 border rounded-md">
            Lottery
          </Link>
        </div>
        <div>
          <Link href={"/white-list"} className="block p-2 border rounded-md">
            Cross chain White list
          </Link>
        </div>
      </div>
    </div>
  );
}
