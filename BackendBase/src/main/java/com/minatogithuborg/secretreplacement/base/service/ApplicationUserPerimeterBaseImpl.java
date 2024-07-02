package com.minatogithuborg.secretreplacement.base.service;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.vs.rappit.base.logger.Logger;
import com.vs.rappit.base.logger.LoggerFactory;

import com.vs.rappit.base.dal.providers.PersistenceType;
import com.vs.rappit.base.acl.AllowedFields;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import com.vs.rappit.base.exception.InternalException;
import com.vs.rappit.base.util.CollectionUtils;
import com.vs.rappit.base.util.ErrorCode;
import com.minatogithuborg.secretreplacement.model.Roles;
import com.vs.rappit.base.authentication.UserPrivilege;
import com.vs.rappit.base.authentication.logic.AppUserPrivilegeCache;
import org.springframework.beans.factory.annotation.Autowired;
import com.vs.rappit.springsecurity.base.authentication.WhitelistedAdminUserProvisioningService;
import java.util.Collections;

import com.vs.rappit.base.acl.IPerimeterManager;
import com.minatogithuborg.secretreplacement.base.model.ApplicationUserBase;
import com.minatogithuborg.secretreplacement.base.model.constants.ApplicationUserConstantBase;

public abstract class ApplicationUserPerimeterBaseImpl<T extends ApplicationUserBase> implements IPerimeterManager<T>, ApplicationUserConstantBase {
	
	private Logger LOGGER = LoggerFactory.getLogger(ApplicationUserPerimeterBaseImpl.class);
	
	@Autowired
	private AppUserPrivilegeCache userCache;
	
	@Autowired
	private WhitelistedAdminUserProvisioningService provisioningService;
	
	@Override
	public boolean canCreate(T model) {
		LOGGER.info("Entering canCreate");
		try {
			if (provisioningService.isWhitelistesAdminUser(model.getEmail())) {
				return true;
			}
			UserPrivilege userPrivilege = userCache.getCurrentUser();
			if (userPrivilege != null && userPrivilege.isJitUser()) {
				return true;
			}
			ApplicationUserBase userBase = (ApplicationUserBase) userPrivilege;
			if (userBase != null && CollectionUtils.isNotEmpty(userBase.getUserRoles())) {
				return userBase.getUserRoles()
				        .stream()
				        .map(Roles::getRoleNameEnum)
				        .filter(Objects::nonNull)
				        .anyMatch(roleName -> Roles.APP_ADMIN.equals(roleName));
			} else {
				LOGGER.error("Application user is not available to verify the perimeter create access ");
				throw new InternalException("Application user is not available to verify the perimeter create access ");
			}
		} catch (Exception e) {
			LOGGER.error("Excepton while reading the perimeter create action {0}",e);
			throw new InternalException(ErrorCode.SAVE_NOT_ALLOWED,e);
		} finally {
			LOGGER.info("Exiting canCreate");
		}
	}

	@Override
	public boolean canUpdate(T model) {
		LOGGER.info("Entering canUpdate");
		try {
			ApplicationUserBase userBase = (ApplicationUserBase) userCache.getCurrentUser();
			if (userBase != null && CollectionUtils.isNotEmpty(userBase.getUserRoles())) {
				return userBase.getUserRoles()
				        .stream()
				        .map(Roles::getRoleNameEnum)
				        .filter(Objects::nonNull)
				        .anyMatch(roleName -> Roles.APP_ADMIN.equals(roleName));
			} else {
				LOGGER.error("Application user is not available to verify the perimeter update access ");
				throw new InternalException("Application user is not available to verify the perimeter update access ");
			}
		} catch (Exception e) {
			LOGGER.error("Excepton while updating the perimeter update action {0}",e);
			throw new InternalException(ErrorCode.UPDATE_NOT_ALLOWED,e);
		} finally {
			LOGGER.info("Exiting canUpdate");
		}
	}

	@Override
	public boolean canDelete(T model) {
		LOGGER.info("Entering canDelete");
		try {
			ApplicationUserBase userBase = (ApplicationUserBase) userCache.getCurrentUser();
			if (userBase != null && CollectionUtils.isNotEmpty(userBase.getUserRoles())) {
				return userBase.getUserRoles()
				        .stream()
				        .map(Roles::getRoleNameEnum)
				        .filter(Objects::nonNull)
				        .anyMatch(roleName -> Roles.APP_ADMIN.equals(roleName));
			} else {
				LOGGER.error("Application user is not available to verify the perimeter delete access ");
				throw new InternalException("Application user is not available to verify the perimeter delete access ");
			}
		} catch (Exception e) {
			LOGGER.error("Excepton while deleting the perimeter action {0}",e);
			throw new InternalException(ErrorCode.DELETE_NOT_ALLOWED,e);
		} finally {
			LOGGER.info("Exiting canDelete");
		}
	}

	@Override
	public boolean canRead(T model) {
		LOGGER.info("Entering canRead");
		try {
			if (provisioningService.isWhitelistesAdminUser(model.getEmail())) {
				return true;
			}
			ApplicationUserBase userBase = (ApplicationUserBase) userCache.getCurrentUser();
			if (userBase != null && StringUtils.equalsIgnoreCase(userBase.getEmail(), model.getEmail())
                		&& BooleanUtils.isTrue(userBase.isLogin())) {
            	return true;
        	}
			if (userBase != null && CollectionUtils.isNotEmpty(userBase.getUserRoles())) {
				return userBase.getUserRoles()
				        .stream()
				        .map(Roles::getRoleNameEnum)
				        .filter(Objects::nonNull)
				        .anyMatch(roleName -> Roles.APP_ADMIN.equals(roleName));
			} else {
				LOGGER.error("Application user is not available to verify the perimeter read access ");
				throw new InternalException("Application user is not available to verify perimeter read access ");
			}
		} catch (Exception e) {
			LOGGER.error("Excepton while reading the perimeter action {0}",e);
			throw new InternalException(ErrorCode.READ_NOT_ALLOWED,e);
		} finally {
			LOGGER.info("Exiting canRead");
		}
	}

	@Override
	public String getAccessQuery(PersistenceType type) {
		return null;
	}

	@Override
	public AllowedFields getSelectFields(PersistenceType type) {
		AllowedFields allowedFields = new AllowedFields();
		ApplicationUserBase userBase = (ApplicationUserBase) userCache.getCurrentUser();
		setReadFields(userBase, allowedFields);
		setWriteFields(userBase, allowedFields);
		return allowedFields;
	}
	
	protected void setReadFields(ApplicationUserBase userBase, AllowedFields allowedFields) {
		Set<String> allowedAccessFields = new HashSet<>();
		allowedAccessFields.addAll(getTechnicalFields());
		if(userBase!=null) {
						if (BooleanUtils.isTrue(userBase.isAppAdmin())) {
			String[] readFields = new String[] {SID, CREATED_BY, CREATED_DATE, MODIFIED_BY, MODIFIED_DATE, EMAIL, FIRST_NAME, LAST_NAME, USER_ROLES, APP_ADMIN};
			allowedAccessFields.addAll(Arrays.asList(readFields));
		}

			if (provisioningService.isWhitelistesAdminUser(userBase.getEmail()) ||  BooleanUtils.isTrue(userBase.isLogin())) {
				allowedAccessFields.add("*");
				List<String> allowedAccessFieldList = new ArrayList<>(allowedAccessFields);
				allowedFields.setAllowedReadFields(allowedAccessFieldList);
				return;
			}
		}

		List<String> allowedAccessFieldList = new ArrayList<>(allowedAccessFields);
		allowedFields.setAllowedReadFields(allowedAccessFieldList);
	}
	protected void setWriteFields(ApplicationUserBase userBase, AllowedFields allowedFields) {
		Set<String> allowedAccessFields = new HashSet<>();
		allowedAccessFields.addAll(getTechnicalFields());
		if(userBase!=null){
						if (BooleanUtils.isTrue(userBase.isAppAdmin())) {
			String[] readFields = new String[] {SID, CREATED_BY, CREATED_DATE, MODIFIED_BY, MODIFIED_DATE, EMAIL, FIRST_NAME, LAST_NAME, USER_ROLES, APP_ADMIN};
			allowedAccessFields.addAll(Arrays.asList(readFields));
		}

			if (provisioningService.isWhitelistesAdminUser(userBase.getEmail()) ||  BooleanUtils.isTrue(userBase.isLogin())) {
				allowedAccessFields.add("*");
				List<String> allowedAccessFieldList = new ArrayList<>(allowedAccessFields);
				allowedFields.setAllowedWriteFields(allowedAccessFieldList);
				return;
			}
		}
		List<String> allowedAccessFieldList = new ArrayList<>(allowedAccessFields);
		allowedFields.setAllowedWriteFields(allowedAccessFieldList);
	}
	protected List<String> getTechnicalFields() {
		String[] technicalFields = {"sid", "createdBy", "createdDate", "modifiedBy", "modifiedDate", "recDeleted", "emailInLowerCase", "userRoles", "email", "firstName", "lastName"};
		List<String> technicalFieldList =  new ArrayList<>();
		Collections.addAll(technicalFieldList, technicalFields);
		return technicalFieldList;
	}
	
	
}