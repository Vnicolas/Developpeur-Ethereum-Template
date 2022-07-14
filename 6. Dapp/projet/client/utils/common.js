import { createStandaloneToast } from "@chakra-ui/toast";

const { toast } = createStandaloneToast();

const idToastError = "error-toast";
const idToastSuccess = "success-toast";
const idToastInfos = "infos-toast";

const handleError = (error) => {
  if (error.code && !toast.isActive(idToastError)) {
    toast({
      id: idToastError,
      title: "A error occured",
      description:
        error.error?.data?.message || error.data?.message || error.message,
      status: "error",
      duration: 3500,
      isClosable: true,
    });
  }
};

const handleSuccess = (message) => {
  if (!toast.isActive(idToastSuccess)) {
    toast({
      id: idToastSuccess,
      title: "Success !",
      description: message,
      status: "success",
      duration: 3500,
      isClosable: true,
    });
  }
};

const handleInfos = (message) => {
  if (!toast.isActive(idToastInfos)) {
    toast({
      id: idToastInfos,
      title: "Information",
      description: message,
      status: "info",
      duration: 3500,
      isClosable: true,
    });
  }
};

export { handleError, handleSuccess, handleInfos };
