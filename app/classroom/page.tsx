import { classroomFactoryContracts } from "@/contracts/contracts";
import Link from "next/link";
import { appNetworkPathRecord, appNetworkRecord } from "@/contracts/settings";

export default async function Page() {
  return (
    <div className="p-4 space-y-4">
      <div className="font-bold">Classroom Factory Contract</div>
      <div>
        <div className="mb-2">Select your network:</div>
        <div className="space-x-4">
          {classroomFactoryContracts.map((_) => (
            <div key={_.address} className="border rounded-md p-1 inline-block">
              <Link
                href={`classroom/networks/${appNetworkPathRecord[_.chainId]}`}
              >
                {appNetworkRecord[_.chainId]?.name}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="text-sm">
        <div className="font-bold">Key Features</div>
        <div>
          <div className="font-bold">Deploy Classrooms On-Chain</div>
          <ul className="list-disc list-inside">
            <li>
              Users can create new classroom contracts dynamically via
              ClassroomFactory.
            </li>
          </ul>
        </div>
        <div>
          <div className="font-bold">Store Metadata per Classroom</div>
          <ul className="list-disc list-inside">
            <li>
              Each classroom stores its own course name and creation date
              immutably.
            </li>
          </ul>
        </div>
        <div>
          <div className="font-bold">Enroll Students in Classrooms</div>
          <ul className="list-disc list-inside">
            <li>
              Anyone can register a student by name and skill level (Beginner,
              Medium, Advanced).
            </li>
          </ul>
        </div>
        <div>
          <div className="font-bold">Query Students by Index</div>
          <ul className="list-disc list-inside">
            <li>
              Retrieve student data from a classroom by index (name + level).
            </li>
          </ul>
        </div>
        <div>
          <div className="font-bold">Factory Contract with Tracking</div>
          <ul className="list-disc list-inside">
            <li>
              ClassroomFactory tracks all deployed classroom contracts with
              metadata.
            </li>
          </ul>
        </div>

        <div>
          <div className="font-bold">Session ID Assignment System</div>
          <ul className="list-disc list-inside">
            <li>
              Assign and retrieve session IDs per wallet address (e.g., for auth
              or tracking).
            </li>
          </ul>
        </div>
        <div>
          <div className="font-bold">Event Emission for Frontend Sync</div>
          <ul className="list-disc list-inside">
            <li>
              Emits events for NewStudentAdded and NewContractCreated to enable
              real-time UI updates.
            </li>
          </ul>
        </div>
        <div>
          <div className="font-bold">Modular Architecture</div>
          <ul className="list-disc list-inside">
            <li>
              Uses a reusable Utils library for cleaner struct and enum
              definitions.
            </li>
          </ul>
        </div>
        <div>
          <div className="font-bold">Gas-Efficient Enums</div>
          <ul className="list-disc list-inside">
            <li>
              Emits events for NewStudentAdded and NewContractCreated to enable
              real-time UI updates.
            </li>
          </ul>
        </div>
        <div>
          <div className="font-bold">Separation of Concerns</div>
          <ul className="list-disc list-inside">
            <li>
              Cleanly separates responsibilities across Utils, Classroom, and
              ClassroomFactory.
            </li>
          </ul>
        </div>
      </div> */}
    </div>
  );
}
