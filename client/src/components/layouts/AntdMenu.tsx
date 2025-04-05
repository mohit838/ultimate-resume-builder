import { ProLayout } from "@ant-design/pro-components";
import customMenuDate from "../../Data/customMenu";

let serviceData: any[] = customMenuDate;

export const AntdMenu = () => {
  return (
    <>
      <ProLayout title="" menuDataRender={() => serviceData}>
        Here will be contet
      </ProLayout>
    </>
  );
};
