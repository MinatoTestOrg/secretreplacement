package com.minatogithuborg.secretreplacement.base.model;

import com.vs.rappit.base.annotations.Searchable;
import com.vs.rappit.base.authentication.UserPrivilege;
import com.vs.rappit.base.annotations.Table;
import jakarta.persistence.Id;
import com.vs.rappit.base.annotations.Searchable;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.MappedSuperclass;
@MappedSuperclass
@jakarta.persistence.Table(name = "ApplicationUser",
				uniqueConstraints = {
			@UniqueConstraint(name = "SIDUnique", columnNames = {"sid"} )})
@Table(name="ApplicationUser", keys={"sid"})
public class ApplicationUserBase extends UserPrivilege {


	@Searchable(index = true)
	private Boolean appAdmin=false;

	public void setAppAdmin(Boolean appAdmin) {
		this.appAdmin = appAdmin;
	}

	public Boolean isAppAdmin() {
		return appAdmin;
	}


}