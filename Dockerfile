FROM centos:7

ARG dotnet_cli_home_arg=/tmp/
ENV DOTNET_CLI_HOME=$dotnet_cli_home_arg

# Install required dependencies and Install .NET SDK 5
RUN rpm -Uvh https://packages.microsoft.com/config/centos/7/packages-microsoft-prod.rpm && \
    yum-config-manager --disable extras-common && \
    yum-config-manager --disable baseos && \
    yum-config-manager --disable appstream && \
    yum -y install dotnet-sdk-5.0.x86_64 && \
    yum clean all && \
    rm -rf /var/cache/yum && \
    mkdir -p /opt/

# Generate and trust the developer certificate
RUN dotnet dev-certs https && \
    dotnet dev-certs https --trust

# Copy your application release with conf files to the container
COPY CustomerCare /opt/CustomerCare

# Set the working directory
WORKDIR /opt/CustomerCare

# Update permissions for the /tmp directory
RUN chmod -R 777 /tmp

EXPOSE 5000

# Start the application
CMD ["dotnet", "/opt/CustomerCare/CustomerCareCore.MVC.dll"]
