package com.minatogithuborg.secretreplacement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minatogithuborg.secretreplacement.util.SQLUtil;

@RestController
@RequestMapping(path = "/rest/rdbms", produces = "application/json")
public class SQLUtilController {
	@Autowired
	SQLUtil sqlUtil;

	// @PreAuthorize("hasAccess('/rdbms/generatesqlscript')")
	@PostMapping(path = "/generatesqlscript", produces = "application/json")
	public ResponseEntity generateSQLScript() {
		return sqlUtil.generateSQLScript();
	}
}
