# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.4.3]
### Fixed
- Redact now check if this is undefined
- ExpressLogger now check if body is buffer

## [1.4.2]
### Fixed
- Type exports. The LoggerConfig type wasn't being exported the right way

## [1.4.1]
### Changed
- Changed test of routes for regular expression to accept path parameters

## [1.4.0]
### Added
- Redact Class, now you can remove keys and values from logs

## [1.3.2]
### Fixed
- Some properties didn't had the right type and now they have because it is using import instead of referencing some imported package

## [1.3.1]
### Fixed
- Fix the build of the package when install inside some project

## [1.3.0]
### Changed
- The logs are logged outside the msg property

### Added
- Accept the log level and streams that change the location of the logs based on their level
- Add check for ip header from CloudFlare

## [1.2.13]
### Fixed
- Declaration of the init function type

## [1.2.12]
### Fixed
- Types definition folder and build

## [1.2.11]
### Fixed
- TSlint rules
- RequestId when logging from Request package

## [1.2.10]
### Fixed
- Fixed this.logger undefined error when using the debugger for RequestDebug

## [1.2.9]
### Changed
- Changed some types to the types folder
- Changed configuration for the compiler

## [1.2.8]
### Added
- Added child logger to use in express logger

### Fixed
- Description README, adding the binding to the loggers

### Changed
- Removed explicit return of interface from init function

## [1.2.7]
### Fixed
- Fixed express logger

## [1.2.6]
### Added
- Added this bind for express logger

## [1.2.5]
### Fixed
- Axios attachInterceptor function

## [1.2.4]
### Fixed
- Axios log error function

## [1.2.3]
### Changed
- Changed the init function but it doesn't affect the old users

## [1.2.2]
### Fixed
- Import logger file path

## [1.2.1]
### Fixed
- Fix readme title and installation sections

## [1.2.0]
### Added
- Request Logger for request package
- Description at README

## [1.1.0]
### Changed
- Moved to classes for Axios and Express Logger
- Changed the package name for @somosphi org

## [1.0.0]
### Added
- Axios Logger
- Express middlewares for logging
- Type description of functions
- Bunyan as the logger
